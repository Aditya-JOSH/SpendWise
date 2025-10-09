module Api
  module V1
    class CategoriesController < ApplicationController
      before_action :authenticate_user!
      before_action :set_category, only: [:show, :update, :destroy]

      # GET /api/v1/categories
      def index
        per  = params.fetch(:per, 50)
        page = params.fetch(:page, 1)
        categories = current_user.categories.ordered_by_name.page(page).per(per)

        render json: {
          data: CategorySerializer.new(categories).serializable_hash[:data],
          meta: {
            page: categories.current_page,
            per: categories.limit_value,
            total_pages: categories.total_pages,
            total_count: categories.total_count
          }
        }, status: :ok
      end

      # POST /api/v1/categories
      def create
        category = current_user.categories.new(category_params)
        if category.save
          render json: CategorySerializer.new(category).serializable_hash, status: :created
        else
          render json: { errors: category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/categories/:id
      def show
        render json: CategorySerializer.new(@category).serializable_hash, status: :ok
      end

      # PATCH/PUT /api/v1/categories/:id
      def update
        if @category.update(category_params)
          render json: CategorySerializer.new(@category).serializable_hash, status: :ok
        else
          render json: { errors: @category.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/categories/:id
      def destroy
        @category.destroy
        head :no_content
      end

      private

      def set_category
        @category = current_user.categories.find(params[:id])
      end

      def category_params
        params.require(:category).permit(:name)
      end
    end
  end
end
