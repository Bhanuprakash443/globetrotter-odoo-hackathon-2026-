"""
AI Services for Itinerary Optimization and Budget Intelligence
"""
from src.config.database import get_db
from datetime import datetime, timedelta
from typing import List, Dict
import json

class AIService:
    @staticmethod
    def optimize_itinerary(trip_id: int) -> Dict:
        """
        AI Itinerary Optimization Engine
        - Optimizes day-wise schedule
        - Avoids travel fatigue
        - Balances activities + rest
        - Respects budget limits
        """
        conn = get_db()
        cursor = conn.cursor()
        
        # Get trip details
        cursor.execute('SELECT * FROM trips WHERE id = ?', (trip_id,))
        trip = cursor.fetchone()
        if not trip:
            conn.close()
            return {'error': 'Trip not found'}
        
        trip_dict = dict(trip)
        
        # Get itinerary sections
        cursor.execute('''
            SELECT * FROM itinerary_sections
            WHERE trip_id = ?
            ORDER BY order_index ASC
        ''', (trip_id,))
        sections = [dict(row) for row in cursor.fetchall()]
        
        # Get all activities
        all_activities = []
        for section in sections:
            cursor.execute('''
                SELECT a.*, c.name as city_name, c.cost_index
                FROM activities a
                LEFT JOIN cities c ON a.city_id = c.id
                WHERE a.itinerary_section_id = ?
                ORDER BY a.day_number ASC, a.time_slot ASC
            ''', (section['id'],))
            activities = [dict(row) for row in cursor.fetchall()]
            all_activities.extend(activities)
        
        # Get budget constraints
        cursor.execute('''
            SELECT COALESCE(SUM(budget), 0) as total_budget
            FROM itinerary_sections
            WHERE trip_id = ?
        ''', (trip_id,))
        total_budget = cursor.fetchone()['total_budget']
        
        # Calculate trip duration
        if trip_dict['start_date'] and trip_dict['end_date']:
            start = datetime.strptime(trip_dict['start_date'], '%Y-%m-%d')
            end = datetime.strptime(trip_dict['end_date'], '%Y-%m-%d')
            days = (end - start).days + 1
        else:
            days = 7  # Default
        
        # AI Optimization Logic
        optimized_activities = AIService._optimize_activity_schedule(
            all_activities, days, total_budget
        )
        
        # Generate optimization insights
        insights = AIService._generate_insights(
            all_activities, optimized_activities, days, total_budget
        )
        
        conn.close()
        
        return {
            'optimized_schedule': optimized_activities,
            'insights': insights,
            'original_activity_count': len(all_activities),
            'optimized_activity_count': len(optimized_activities),
            'budget_efficiency': insights.get('budget_savings', 0)
        }
    
    @staticmethod
    def _optimize_activity_schedule(activities: List[Dict], days: int, budget: float) -> List[Dict]:
        """Optimize activity distribution across days"""
        if not activities:
            return []
        
        # Group activities by type
        activity_types = {}
        for activity in activities:
            activity_type = activity.get('activity_type', 'Other')
            if activity_type not in activity_types:
                activity_types[activity_type] = []
            activity_types[activity_type].append(activity)
        
        # Distribute activities intelligently
        optimized = []
        activities_per_day = max(2, min(4, len(activities) // days))  # 2-4 activities per day
        
        # Balance activity types across days
        for day in range(1, days + 1):
            day_activities = []
            day_cost = 0
            day_start_time = 9  # Start at 9 AM
            
            # Select mix of activity types per day
            type_rotation = ['Sightseeing', 'Food', 'Activity', 'Culture', 'Nature']
            for activity_type in type_rotation:
                if activity_type in activity_types and activity_types[activity_type]:
                    activity = activity_types[activity_type].pop(0)
                    activity_cost = activity.get('cost', 0) or 0
                    
                    # Check budget constraint
                    if day_cost + activity_cost <= (budget / days) * 1.2:  # 20% buffer
                        activity['optimized_day'] = day
                        activity['optimized_time'] = f"{day_start_time}:00 AM"
                        day_start_time += 3  # 3 hours between activities
                        day_cost += activity_cost
                        day_activities.append(activity)
                        
                        if len(day_activities) >= activities_per_day:
                            break
            
            optimized.extend(day_activities)
            
            # Add rest periods
            if day % 2 == 0:  # Every other day, add a rest slot
                optimized.append({
                    'name': 'Rest Period',
                    'activity_type': 'Rest',
                    'optimized_day': day,
                    'optimized_time': '2:00 PM - 4:00 PM',
                    'cost': 0,
                    'description': 'Relaxation time to avoid travel fatigue'
                })
        
        return optimized
    
    @staticmethod
    def _generate_insights(original: List[Dict], optimized: List[Dict], days: int, budget: float) -> Dict:
        """Generate AI insights about optimization"""
        original_cost = sum(a.get('cost', 0) or 0 for a in original)
        optimized_cost = sum(a.get('cost', 0) or 0 for a in optimized)
        savings = original_cost - optimized_cost
        
        # Calculate activity distribution
        activity_distribution = {}
        for activity in optimized:
            activity_type = activity.get('activity_type', 'Other')
            activity_distribution[activity_type] = activity_distribution.get(activity_type, 0) + 1
        
        insights = {
            'optimization_score': min(100, int((savings / max(original_cost, 1)) * 100 + 50)),
            'budget_savings': savings,
            'budget_efficiency': f"{(optimized_cost / max(budget, 1)) * 100:.1f}%",
            'activity_balance': activity_distribution,
            'recommendations': []
        }
        
        # Add recommendations
        if optimized_cost > budget:
            insights['recommendations'].append(
                f"⚠️ Total cost (₹{optimized_cost:,.0f}) exceeds budget (₹{budget:,.0f}) by ₹{optimized_cost - budget:,.0f}"
            )
        
        if days > 5 and len(optimized) / days > 4:
            insights['recommendations'].append(
                "💡 Consider reducing activities per day to avoid travel fatigue"
            )
        
        # Balance check
        if activity_distribution.get('Sightseeing', 0) > days * 2:
            insights['recommendations'].append(
                "⚖️ Too many sightseeing activities. Mix in food, culture, and relaxation."
            )
        
        return insights
    
    @staticmethod
    def analyze_budget(trip_id: int) -> Dict:
        """
        Smart Budget Intelligence
        - Predicts total trip cost
        - Alerts when user is over budget
        - Suggests cheaper alternatives
        """
        conn = get_db()
        cursor = conn.cursor()
        
        # Get trip budget
        cursor.execute('''
            SELECT t.total_budget,
                   COALESCE(SUM(isec.budget), 0) as section_budget
            FROM trips t
            LEFT JOIN itinerary_sections isec ON t.id = isec.trip_id
            WHERE t.id = ?
            GROUP BY t.id
        ''', (trip_id,))
        result = cursor.fetchone()
        
        if not result:
            conn.close()
            return {'error': 'Trip not found'}
        
        total_budget = result['total_budget'] or result['section_budget'] or 0
        
        # Get all expenses and planned costs
        cursor.execute('''
            SELECT 
                COALESCE(SUM(exp.amount), 0) as total_spent,
                COALESCE(SUM(a.cost), 0) as planned_activity_cost
            FROM trips t
            LEFT JOIN expenses exp ON t.id = exp.trip_id
            LEFT JOIN itinerary_sections isec ON t.id = isec.trip_id
            LEFT JOIN activities a ON isec.id = a.itinerary_section_id
            WHERE t.id = ?
        ''', (trip_id,))
        
        costs = cursor.fetchone()
        total_spent = costs['total_spent'] or 0
        planned_cost = costs['planned_activity_cost'] or 0
        
        # Get all activities with alternatives
        cursor.execute('''
            SELECT a.*, c.name as city_name, c.cost_index
            FROM activities a
            JOIN itinerary_sections isec ON a.itinerary_section_id = isec.id
            LEFT JOIN cities c ON a.city_id = c.id
            WHERE isec.trip_id = ?
            ORDER BY a.cost DESC
        ''', (trip_id,))
        
        activities = [dict(row) for row in cursor.fetchall()]
        
        # Predict total cost
        predicted_total = total_spent + planned_cost
        
        # Generate budget analysis
        analysis = {
            'predicted_total': predicted_total,
            'budget_limit': total_budget,
            'current_spent': total_spent,
            'planned_cost': planned_cost,
            'remaining_budget': total_budget - predicted_total,
            'budget_status': 'within_budget',
            'over_budget_by': 0,
            'suggestions': []
        }
        
        # Check if over budget
        if predicted_total > total_budget:
            analysis['budget_status'] = 'over_budget'
            analysis['over_budget_by'] = predicted_total - total_budget
            
            # Generate suggestions for expensive activities
            expensive_activities = [a for a in activities if (a.get('cost') or 0) > 500]
            
            for activity in expensive_activities[:3]:  # Top 3 expensive
                alternative_cost = (activity.get('cost') or 0) * 0.6  # 40% cheaper alternative
                savings = (activity.get('cost') or 0) - alternative_cost
                
                analysis['suggestions'].append({
                    'current_activity': activity.get('name'),
                    'current_cost': activity.get('cost', 0),
                    'suggestion': f"Consider replacing '{activity.get('name')}' with a similar cheaper option",
                    'potential_savings': savings,
                    'alternative_cost': alternative_cost,
                    'message': f"Your trip exceeds budget by ₹{analysis['over_budget_by']:,.0f}. Consider replacing '{activity.get('name')}' (₹{activity.get('cost', 0):,.0f}) with a cheaper alternative (₹{alternative_cost:,.0f}) to save ₹{savings:,.0f}."
                })
        
        # Budget efficiency score
        if total_budget > 0:
            efficiency = (predicted_total / total_budget) * 100
            analysis['budget_efficiency'] = efficiency
            analysis['budget_efficiency_status'] = (
                'excellent' if efficiency < 80 else
                'good' if efficiency < 95 else
                'caution' if efficiency < 110 else
                'over_budget'
            )
        
        # Category-wise breakdown
        cursor.execute('''
            SELECT 
                expense_category,
                SUM(amount) as total,
                COUNT(*) as count
            FROM expenses
            WHERE trip_id = ?
            GROUP BY expense_category
        ''', (trip_id,))
        
        analysis['category_breakdown'] = [
            dict(row) for row in cursor.fetchall()
        ]
        
        conn.close()
        
        return analysis


