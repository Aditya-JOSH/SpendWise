require 'rails_helper'

RSpec.describe Api::V1::BudgetsController, type: :controller do
  let(:user) { create(:user) }

  # Use the sign_in helper for controller specs
  before do
    sign_in user
  end

  describe 'GET #index' do
    before do
      create_list(:budget, 2, user: user)
    end

    it 'returns a successful response with data and meta' do
      get :index
      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)
      expect(json).to have_key('data')
      expect(json['data']).to be_an(Array)
      expect(json['data'].length).to eq(2)

      expect(json).to have_key('meta')
      expect(json['meta']).to include('page', 'per', 'total_pages', 'total_count')
    end
  end

  describe 'GET #show' do
    let(:budget) { create(:budget, user: user) }

    it 'returns the specific budget' do
      get :show, params: { id: budget.id }
      expect(response).to have_http_status(:success)

      json = JSON.parse(response.body)
      returned_id = json['id'] || json.dig('data', 'id')
      expect(returned_id.to_s).to eq(budget.id.to_s)
    end
  end

  describe 'POST #create' do
    let(:valid_attributes) { { name: 'New Car Fund', financial_goal: 800 } }

    it 'creates a new budget' do
      expect {
        post :create, params: { budget: valid_attributes }
      }.to change(Budget, :count).by(1)
      expect(response).to have_http_status(:created)
    end

    it 'returns errors for invalid attributes' do
      post :create, params: { budget: { name: nil } }
      expect(response).to have_http_status(:unprocessable_entity)
      json = JSON.parse(response.body)
      expect(json).to have_key('errors').or have_key('error').or have_key('message')
    end
  end

  describe 'PUT #update' do
    let(:budget) { create(:budget, user: user) }

    it 'updates the budget and returns serialized data' do
      put :update, params: {
        id: budget.id,
        budget: { name: 'Updated Budget Name' }
      }

      expect(response).to have_http_status(:ok)

      expect(budget.reload.name).to eq('Updated Budget Name')

      json = JSON.parse(response.body)

      expect(json).to have_key('id').or have_key('data')
      if json.key?('data')
        expect(json['data']['id'].to_s).to eq(budget.id.to_s)
        expect(json['data']['attributes']['name']).to eq('Updated Budget Name')
      else
        expect(json['id'].to_s).to eq(budget.id.to_s)
      end
    end
  end

  describe 'DELETE #destroy' do
    # Use let! to ensure the budget is created before the test runs
    let!(:budget) { create(:budget, user: user) }

    it 'deletes the budget' do
      expect {
        delete :destroy, params: { id: budget.id }
      }.to change(Budget, :count).by(-1)
      expect(response).to have_http_status(:no_content).or have_http_status(:success)
    end
  end
end
