require 'rails_helper'

RSpec.describe Api::V1::BudgetsController, type: :controller do
  let(:user) { create(:user) }

  # Use the sign_in helper for controller specs
  before do
    sign_in user
  end

  describe 'GET #index' do
    # Create data inside a before block for this specific action
    before do
      create_list(:budget, 2, user: user)
    end

    it 'returns a successful response' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it "returns the user's budgets" do
      get :index
      json_response = JSON.parse(response.body)
      expect(json_response.size).to eq(2)
    end
  end

  describe 'GET #show' do
    let(:budget) { create(:budget, user: user) }

    it 'returns the specific budget' do
      get :show, params: { id: budget.id }
      json_response = JSON.parse(response.body)
      expect(response).to have_http_status(:success)
      expect(json_response['id']).to eq(budget.id)
    end
  end

  describe 'POST #create' do
    let(:valid_attributes) { { name: 'New Car Fund', financial_goal: 800 } }

    it 'creates a new budget' do
      expect {
        post :create, params: { budget: valid_attributes }
      }.to change(Budget, :count).by(1)
    end

    it 'returns errors for invalid attributes' do
      post :create, params: { budget: { name: nil } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT #update' do
    let(:budget) { create(:budget, user: user) }

    it 'updates the budget' do
      put :update, params: {
        id: budget.id,
        budget: { name: 'Updated Budget Name' }
      }
      # reload the record from the database to check for the new name
      expect(budget.reload.name).to eq('Updated Budget Name')
    end
  end

  describe 'DELETE #destroy' do
    # Use let! to ensure the budget is created before the test runs
    let!(:budget) { create(:budget, user: user) }

    it 'deletes the budget' do
      expect {
        delete :destroy, params: { id: budget.id }
      }.to change(Budget, :count).by(-1)
    end
  end
end