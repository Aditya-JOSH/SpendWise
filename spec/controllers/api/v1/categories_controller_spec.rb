require 'rails_helper'

RSpec.describe Api::V1::CategoriesController, type: :controller do
  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe 'GET #index' do
    before do
      create_list(:category, 3, user: user)
    end

    it 'returns a successful response' do
      get :index
      expect(response).to have_http_status(:success)
    end

    it 'returns user categories' do
      get :index
      json_response = JSON.parse(response.body)
      expect(json_response['data'].length).to eq(3)
    end
  end

  describe 'POST #create' do
    let(:valid_attributes) { { name: 'New Category' } }

    it 'creates a new category' do
      expect {
        post :create, params: { category: valid_attributes }
      }.to change(Category, :count).by(1)
    end

    it 'returns errors for invalid attributes' do
      post :create, params: { category: { name: nil } }
      expect(response).to have_http_status(:unprocessable_entity)
    end
  end

  describe 'PUT #update' do
    let(:category) { create(:category, user: user) }

    it 'updates the category' do
      put :update, params: {
        id: category.id,
        category: { name: 'Updated Category' }
      }
      expect(category.reload.name).to eq('Updated Category')
    end
  end

  describe 'DELETE #destroy' do
    let!(:category) { create(:category, user: user) }

    it 'deletes the category' do
      expect {
        delete :destroy, params: { id: category.id }
      }.to change(Category, :count).by(-1)
    end
  end
end
