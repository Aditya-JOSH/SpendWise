require 'rails_helper'

RSpec.describe Api::V1::TransactionsController, type: :controller do
  let(:user) { create(:user) }
  let(:other_user) { create(:user) }
  let(:budget) { create(:budget, user: user) }
  let(:other_budget) { create(:budget, user: other_user) }
  let(:category) { create(:category, user: user) }

  before do
    sign_in user
  end

  describe 'GET #index' do
    before do
      create_list(:transaction, 3, budget: budget, category: category, date: 1.day.ago)
      create_list(:transaction, 2, budget: other_budget, category: category)
    end

    it 'returns paginated transactions for a budget with data and meta' do
      get :index, params: { budget_id: budget.id, page: 1, per: 2 }
      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)
      expect(json).to include('data', 'meta')
      expect(json['data'].length).to eq(2)
      expect(json['meta']).to include('page', 'per', 'total_pages', 'total_count')
    end

    it 'returns transactions for current user when no budget_id is provided' do
      get :index
      expect(response).to have_http_status(:success)
      json = JSON.parse(response.body)
      expect(json['data']).to be_an(Array)
      ids = json['data'].map { |d| d['id'].to_i }
      expect(ids).to all(satisfy { |id|
        Transaction.find(id).budget.user_id == user.id
      })
    end

    context 'filters' do
      it 'filters by date range' do
        from = 2.days.ago.iso8601
        to = Time.current.iso8601
        get :index, params: { budget_id: budget.id, from: from, to: to }
        expect(response).to have_http_status(:success)
      end

      it 'filters by category' do
        get :index, params: { budget_id: budget.id, category_id: category.id }
        expect(response).to have_http_status(:success)
      end
    end

    context 'when unauthenticated' do
      before { sign_out user }

      it 'returns 401 unauthorized' do
        get :index
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET #show' do
    let(:transaction) { create(:transaction, budget: budget, category: category) }

    it 'returns the requested transaction' do
      get :show, params: { budget_id: budget.id, id: transaction.id }
      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)
      returned_id = json['id'] || json.dig('data', 'id')
      expect(returned_id.to_s).to eq(transaction.id.to_s)
    end
  end

  describe 'POST #create' do
    let(:valid_params) do
      {
        amount: 100.5,
        description: 'Test transaction',
        date: Time.current.iso8601,
        category_id: category.id
      }
    end

    it 'creates a transaction under the budget' do
      expect {
        post :create, params: { budget_id: budget.id, transaction: valid_params }
      }.to change(Transaction, :count).by(1)
      expect(response).to have_http_status(:created)

      json = JSON.parse(response.body)
      expect(json).to have_key('data').or have_key('id')
    end

    it 'returns errors for invalid params' do
      post :create, params: { budget_id: budget.id, transaction: { amount: nil } }
      expect(response).to have_http_status(:unprocessable_entity)

      json = JSON.parse(response.body)
      expect(json).to have_key('errors')
    end
  end

  describe 'PUT #update' do
    let(:transaction) { create(:transaction, budget: budget, category: category, amount: 50) }

    it 'updates the transaction attributes' do
      put :update, params: { budget_id: budget.id, id: transaction.id, transaction: { amount: 200 } }
      expect(response).to have_http_status(:success)
      expect(transaction.reload.amount).to eq(200)

      json = JSON.parse(response.body)
      returned_id = json['id'] || json.dig('data', 'id')
      expect(returned_id.to_s).to eq(transaction.id.to_s)
    end

    it 'returns unprocessable_entity for invalid update' do
      put :update, params: { budget_id: budget.id, id: transaction.id, transaction: { amount: nil } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'DELETE #destroy' do
    let!(:transaction) { create(:transaction, budget: budget, category: category) }

    it 'destroys the transaction' do
      expect {
        delete :destroy, params: { budget_id: budget.id, id: transaction.id }
      }.to change(Transaction, :count).by(-1)
      expect(response).to have_http_status(:no_content).or have_http_status(:success)
    end
  end
end
