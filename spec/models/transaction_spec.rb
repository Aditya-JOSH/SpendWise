require 'rails_helper'

RSpec.describe Transaction, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:amount) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:date) }
    it { should validate_numericality_of(:amount).is_greater_than(0) }
  end

  describe 'associations' do
    it { should belong_to(:budget) }
    it { should belong_to(:category) }
  end

  describe 'scopes' do
    let(:budget) { create(:budget) }
    let(:category) { create(:category) }

    let!(:old_transaction) { create(:transaction, budget: budget, category: category, date: 1.day.ago.change(hour: 10)) }
    let!(:today_transaction) { create(:transaction, budget: budget, category: category, date: Time.current.change(hour: 12)) }
    let!(:future_transaction) { create(:transaction, budget: budget, category: category, date: 1.day.from_now.change(hour: 15)) }

    describe '.on_or_after' do
      it 'returns transactions on or after a specific datetime' do
        result = Transaction.on_or_after(Time.current.beginning_of_day)
        expect(result).to include(today_transaction, future_transaction)
        expect(result).not_to include(old_transaction)
        expect(result.count).to eq(2)
      end
    end

    describe '.on_or_before' do
      it 'returns transactions on or before a specific datetime' do
        result = Transaction.on_or_before(Time.current.end_of_day)
        expect(result).to include(old_transaction, today_transaction)
        expect(result).not_to include(future_transaction)
        expect(result.count).to eq(2)
      end
    end

    describe '.for_category' do
      it 'returns transactions for specific category' do
        result = Transaction.for_category(category.id)
        expect(result.count).to eq(3)
      end
    end
  end
end
