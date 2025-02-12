from features.manual_recipe.manual_recipe_service import ManualRecipeService

# Initialize services
add_recipe_service = AddRecipeService(db)
user_service = UserService(db)
ratings_service = RatingsService(db)
schedule_service = ScheduleService(db)
try_list_service = TryListService(db)
reactions_service = ReactionsService(db)
feed_service = FeedService(db)
video_service = VideoService(db)
manual_recipe_service = ManualRecipeService(db)

# Manual Recipe endpoints
@app.post("/api/manual-recipe/generate")
@log_operation("generate_manual_recipe")
async def generate_manual_recipe(prompt: str, token_data=Depends(verify_token)):
    """Generate initial recipe and meal image from prompt."""
    request_id = f"generate-recipe-{int(time.time())}"
    
    # Create recipe log
    log_result = await manual_recipe_service.create_recipe_log(token_data['uid'], prompt, request_id)
    
    # Generate initial recipe
    result = await manual_recipe_service.generate_initial_recipe(log_result['logId'], request_id)
    
    return result

@app.put("/api/manual-recipe/{log_id}/update")
@log_operation("update_manual_recipe")
async def update_manual_recipe(
    log_id: str,
    updates: Dict[str, Any],
    token_data=Depends(verify_token)
):
    """Update recipe or image based on user feedback."""
    request_id = f"update-recipe-{int(time.time())}"
    return await manual_recipe_service.update_recipe(log_id, updates, request_id)

@app.post("/api/manual-recipe/{log_id}/confirm")
@log_operation("confirm_manual_recipe")
async def confirm_manual_recipe(log_id: str, token_data=Depends(verify_token)):
    """Confirm recipe and generate final assets."""
    request_id = f"confirm-recipe-{int(time.time())}"
    return await manual_recipe_service.confirm_recipe(log_id, request_id)

@app.get("/api/manual-recipe/{log_id}")
@log_operation("get_manual_recipe")
async def get_manual_recipe(log_id: str, token_data=Depends(verify_token)):
    """Get the current status of a manual recipe."""
    request_id = f"get-recipe-{int(time.time())}"
    return await manual_recipe_service.get_recipe_log(log_id, request_id)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8001, reload=True) 