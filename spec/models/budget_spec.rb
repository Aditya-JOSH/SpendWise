require 'rails_helper'

RSpec.describe Budget, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:financial_goal) }
    it { should validate_numericality_of(:financial_goal).is_greater_than(0) }
  end

  describe 'associations' do
    it { should belong_to(:user) }
    it { should have_many(:transactions) }
  end

  describe 'calculations' do
    let(:user) { create(:user) }
    let(:budget) { create(:budget, user: user, financial_goal: 1000.0) }

    context 'total_spent' do
      it 'returns 0 when there are no transactions' do
        expect(budget.total_spent.to_f).to eq(0.0)
      end

      it 'sums transaction amounts for the budget' do
        create(:transaction, budget: budget, amount: 150.0)
        create(:transaction, budget: budget, amount: 75.5)
        create(:transaction, budget: budget, amount: 24.5)

        expect(budget.total_spent.to_f).to eq(250.0)
      end

      it 'does not include transactions from other budgets' do
        other_budget = create(:budget, user: user)
        create(:transaction, budget: other_budget, amount: 500.0)
        create(:transaction, budget: budget, amount: 50.0)

        expect(budget.total_spent.to_f).to eq(50.0)
      end
    end

    context 'remaining_amount' do
      it 'returns financial_goal when no transactions exist' do
        expect(budget.remaining_amount.to_f).to eq(1000.0)
      end

      it 'returns financial_goal minus total_spent' do
        create(:transaction, budget: budget, amount: 200.0)
        create(:transaction, budget: budget, amount: 100.0)

        expect(budget.remaining_amount.to_f).to eq(700.0)
      end

      it 'can be negative when spent exceeds goal' do
        create(:transaction, budget: budget, amount: 1200.0)

        expect(budget.remaining_amount.to_f).to eq(-200.0)
      end
    end
  end
end
