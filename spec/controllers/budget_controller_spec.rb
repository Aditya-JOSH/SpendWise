require 'rails_helper'

RSpec.describe "Budgets API", type: :request do
  let(:user) { create(:user) }
  let!(:budgets) { user.budgets.create([{ name: "Monthly Budget", financial_goal: 1500 }, { name: "Vacation Fund", financial_goal: 2000 }]) }
  let(:budget_id) { budgets.first.id }
  let(:user_headers) { auth_headers(user) }

  before do
    sign_in user
  end
  

  describe "POST /api/v1/budgets" do
    let(:valid_attributes) { { budget: { name: "New Car Fund", financial_goal: 800 } } }

    context "when the request is valid" do
      before { post '/api/v1/budgets', params: valid_attributes, headers: user_headers }

      it "creates a new budget" do
        expect {
          post '/api/v1/budgets', params: valid_attributes, headers: user_headers
        }.to change(Budget, :count).by(1)
      end

      it "returns a status code 201 (created)" do
        expect(response).to have_http_status(:created)
      end

      it "returns the created budget as JSON" do
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq("New Car Fund")
      end
    end

    context "when the request is invalid (e.g., name is missing)" do
      let(:invalid_attributes) { { budget: { financial_goal: 500 } } }

      before { post '/api/v1/budgets', params: invalid_attributes, headers: user_headers }

      it "does not create a new budget" do
        expect {
          post '/api/v1/budgets', params: invalid_attributes, headers: user_headers
        }.not_to change(Budget, :count)
      end

      it "returns a status code 422 (unprocessable entity)" do
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it "returns a validation failure message" do
        json_response = JSON.parse(response.body)
        expect(json_response['errors']).to include("Name can't be blank")
      end
    end
  end

  describe "GET /api/v1/budgets" do
    context "when the user is authenticated" do
      before { get '/api/v1/budgets', headers: user_headers }
      it "returns the user's budgets" do
        json_response = JSON.parse(response.body)
        expect(json_response).not_to be_empty
        expect(json_response.size).to eq(2)
      end

      it "returns a status code 200 (ok)" do
        expect(response).to have_http_status(:ok)
      end
    end

    context "when the user is not authenticated" do
      before { get '/api/v1/budgets' }
      it "returns a status code 401 (unauthorized)" do
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe "GET /api/v1/budgets/:id" do
    context "when the budget exists and belongs to the user" do
      before { get "/api/v1/budgets/#{budget_id}", headers: user_headers }
      it "returns the budget" do
        json_response = JSON.parse(response.body)
        expect(json_response['id']).to eq(budget_id)
        expect(json_response['name']).to eq('Monthly Budget')
      end

      it "returns status code 200 (ok)" do
        expect(response).to have_http_status(:ok)
      end
    end
  end

  describe "PUT /api/v1/budgets/:id" do
    let(:valid_attributes) { { budget: { name: "College Fund", financial_goal: 40000 } } }
    context "when the budget exists and belongs to the user" do
      before { put "/api/v1/budgets/#{budget_id}", params: valid_attributes, headers: user_headers }

      it "returns a status code 200 (ok)" do
        expect(response).to have_http_status(:ok)
      end

      it "returns the updated budget as JSON" do
        json_response = JSON.parse(response.body)
        expect(json_response['name']).to eq("College Fund")
      end
    end
  end

  describe "DELETE /api/v1/budgets/:id" do
    context "when the budget exists and belongs to the user" do
      it "deletes the budget from the database" do
        expect {
          delete "/api/v1/budgets/#{budget_id}", headers: user_headers
        }.to change(Budget, :count).by(-1)
      end
      
      it "returns a status code 204 (no content)" do
        delete "/api/v1/budgets/#{budget_id}", headers: user_headers
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end

