module Api
  module V1
    class BudgetsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_budget, only: [:show, :update, :destroy]

      # GET /api/v1/budgets
      def index
        per  = params.fetch(:per, 20)
        page = params.fetch(:page, 1)

        scoped = current_user.budgets
        budgets = scoped.order(created_at: :desc).page(page).per(per)

        render json: {
          data: BudgetSerializer.new(budgets).serializable_hash[:data],
          meta: {
            page: budgets.current_page,
            per: budgets.limit_value,
            total_pages: budgets.total_pages,
            total_count: budgets.total_count
          }
        }, status: :ok
      end

      # POST /api/v1/budgets
      def create
        budget = current_user.budgets.build(budget_params)
        if budget.save
          render json: budget, status: :created
        else
          render json: { errors: budget.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/budgets/:id
      def show
        render json: @budget, status: :ok
      end

      # PATCH/PUT /api/v1/budgets/:id
      def update
        if @budget.update(budget_params)
          render json: @budget, status: :ok
        else
          render json: { errors: @budget.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/budgets/:id
      def destroy
        @budget.destroy
        head :no_content
      end

      private

      def set_budget
        @budget = current_user.budgets.find(params[:id])
      rescue ActiveRecord::RecordNotFound => e
        render json: e.message, status: :unauthorized
      end

      # Strong params
      def budget_params
        params.require(:budget).permit(:name, :financial_goal)
      end
    end
  end
end

