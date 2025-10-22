module Api
  module V1
    class TransactionsController < ApplicationController
      before_action :authenticate_user!
      before_action :set_budget, if: -> { params[:budget_id].present? }
      before_action :set_transaction, only: [:show, :update, :destroy]

      # GET /api/v1/budgets/:budget_id/transactions or /api/v1/transactions
      def index
        per  = params.fetch(:per, 20)
        page = params.fetch(:page, 1)
        from = params[:from]
        to   = params[:to]
        category_id = params[:category_id]
        scoped = @budget ? @budget.transactions.includes(:budget, :category) : Transaction.for_user(current_user)

        transactions = scoped
                         .on_or_after(from)
                         .on_or_before(to)
                         .for_category(category_id)
                         .ordered_newest_first
                         .page(page)
                         .per(per)  

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
        @budget = current_user.budgets.find(params[:budget_id])
      end

      def set_transaction
        @transaction =
          if @budget
            @budget.transactions.find(params[:id])
          else
            Transaction.joins(:budget)
                      .where(budgets: { user_id: current_user.id })
                      .find(params[:id])
          end
      end

      def transaction_params
        params.require(:transaction).permit(:description, :amount, :date, :category_id)
      end
    end
  end
end
