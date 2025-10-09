require 'rails_helper'

RSpec.describe Budget, type: :model do
  describe "validations" do
    let(:user) { User.create(name: "Test User", email: "test@example.com", password: "password") }

    context "when a budget has no name" do
      it "is not valid" do
        budget = Budget.new(name: nil, financial_goal: 1000, user: user)
        expect(budget).not_to be_valid
        expect(budget.errors[:name]).to include("can't be blank")
      end
    end

    context "when a budget has a negative financial goal" do
      it "is not valid" do
        budget = Budget.new(name: "John", financial_goal: -1000, user: user)
        expect(budget).not_to be_valid
        expect(budget.errors[:financial_goal]).to include("must be greater than or equal to 0")
      end
    end

    context "when a budget has valid attributes" do
      it "is valid" do
        budget = Budget.new(name: "John", financial_goal: 1000, user: user)
        expect(budget).to be_valid
      end
    end
  end
end
