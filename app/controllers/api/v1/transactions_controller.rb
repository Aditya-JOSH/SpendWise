module Api
  module V1
    class TransactionsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_budget
      before_action :set_transaction, only: [:show, :update, :destroy]

      # GET /api/v1/budgets/:budget_id/transactions
      def index
        per  = params.fetch(:per, 20)
        page = params.fetch(:page, 1)
        from = params[:from]
        to   = params[:to]
        category_id = params[:category_id]

        scoped = @budget.transactions
        scoped = scoped.on_or_after(from)
        scoped = scoped.on_or_before(to)
        scoped = scoped.for_category(category_id)
        transactions = scoped.ordered_newest_first.page(page).per(per)

        render json: {
          data: TransactionSerializer.new(transactions).serializable_hash[:data],
          meta: {
            page: transactions.current_page,
            per: transactions.limit_value,
            total_pages: transactions.total_pages,
            total_count: transactions.total_count
          }
        }, status: :ok
      end

      # POST /api/v1/budgets/:budget_id/transactions
      def create
        transaction = @budget.transactions.new(transaction_params)
        if transaction.save
          render json: TransactionSerializer.new(transaction).serializable_hash, status: :created
        else
          render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # GET /api/v1/budgets/:budget_id/transactions/:id
      def show
        render json: TransactionSerializer.new(@transaction).serializable_hash, status: :ok
      end

      # PATCH/PUT /api/v1/budgets/:budget_id/transactions/:id
      def update
        if @transaction.update(transaction_params)
          render json: TransactionSerializer.new(@transaction).serializable_hash, status: :ok
        else
          render json: { errors: @transaction.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/budgets/:budget_id/transactions/:id
      def destroy
        @transaction.destroy
        head :no_content
      end

      private

      def set_budget
        @budget = Budget.find(params[:budget_id])
      end

      def set_transaction
        @transaction = @budget.transactions.find(params[:id])
      end

      def transaction_params
        params.require(:transaction).permit(:description, :amount, :date, :category_id)
      end
    end
  end
end
