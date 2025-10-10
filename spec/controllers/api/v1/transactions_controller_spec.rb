require 'rails_helper'

RSpec.describe Api::V1::TransactionsController, type: :controller do
  let(:user) { create(:user) }
  let(:budget) { create(:budget, user: user) }
  let(:category) { create(:category, user: user) }

  before do
    sign_in user
  end

  describe 'GET #index' do
    before do
      create_list(:transaction, 3, budget: budget, category: category)
    end

    it 'returns a successful response' do
      get :index, params: { budget_id: budget.id }
      expect(response).to have_http_status(:success)
    end

    it 'returns paginated results' do
      get :index, params: { budget_id: budget.id, page: 1, per: 2 }
      json_response = JSON.parse(response.body)
      expect(json_response['data'].length).to eq(2)
    end

    context 'with filters' do
      it 'filters by date range' do
        get :index, params: { 
          budget_id: budget.id, 
          from: 1.day.ago.iso8601, 
          to: Time.current.iso8601
        }
        expect(response).to have_http_status(:success)
      end

      it 'filters by category' do
        get :index, params: { budget_id: budget.id, category_id: category.id }
        expect(response).to have_http_status(:success)
      end
    end
  end

  describe 'POST #create' do
    let(:valid_attributes) do
      {
        amount: 100,
        description: 'Test transaction',
        date: Time.current,
        category_id: category.id
      }
    end

    it 'creates a new transaction' do
      expect {
        post :create, params: { 
          budget_id: budget.id, 
          transaction: valid_attributes 
        }
      }.to change(Transaction, :count).by(1)
    end

    it 'returns errors for invalid attributes' do
      post :create, params: { 
        budget_id: budget.id, 
        transaction: { amount: nil } 
      }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT #update' do
    let(:transaction) { create(:transaction, budget: budget, category: category) }

    it 'updates the transaction' do
      put :update, params: {
        budget_id: budget.id,
        id: transaction.id,
        transaction: { amount: 200 }
      }
      expect(transaction.reload.amount).to eq(200)
    end
  end

  describe 'DELETE #destroy' do
    let!(:transaction) { create(:transaction, budget: budget, category: category) }

    it 'deletes the transaction' do
      expect {
        delete :destroy, params: { budget_id: budget.id, id: transaction.id }
      }.to change(Transaction, :count).by(-1)
    end
  end
end
