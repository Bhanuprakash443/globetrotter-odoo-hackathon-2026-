"""
Community routes
"""
from flask import Blueprint
from src.controllers.community_controller import CommunityController

bp = Blueprint('community', __name__)

bp.add_url_rule('/community/posts', 'get_posts', CommunityController.get_posts, methods=['GET'])


