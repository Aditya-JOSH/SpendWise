require 'rails_helper'

RSpec.describe Transaction, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:amount) }
    it { should validate_numericality_of(:amount).is_greater_than(0) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:date) }
  end

  describe 'associations' do
    it { should belong_to(:budget) }
    it { should belong_to(:category) }
  end

  describe 'scopes' do
    let(:user) { create(:user) }
    let(:other_user) { create(:user) }
    let(:budget) { create(:budget, user: user) }
    let(:other_budget) { create(:budget, user: other_user) }
    let(:category) { create(:category, user: user) }
    let(:other_category) { create(:category, user: user) }

    let!(:old_transaction) {
      create(:transaction, budget: budget, category: category, date: 3.days.ago.change(hour: 10))
    }
    let!(:today_transaction) {
      create(:transaction, budget: budget, category: category, date: Time.current.change(hour: 12))
    }
    let!(:future_transaction) {
      create(:transaction, budget: budget, category: category, date: 2.days.from_now.change(hour: 15))
    }
    let!(:other_category_tx) {
      create(:transaction, budget: budget, category: other_category, date: Time.current)
    }
    let!(:other_user_tx) {
      create(:transaction, budget: other_budget, category: category, date: Time.current)
    }

    describe '.on_or_after' do
      it 'returns transactions on or after the given datetime' do
        result = Transaction.on_or_after(Time.current.beginning_of_day)
        expect(result).to include(today_transaction, future_transaction)
        expect(result).not_to include(old_transaction)
      end

      it 'does not apply a date lower-bound when from_date is blank' do
        result = Transaction.on_or_after(nil)
        expect(result).to be_an(ActiveRecord::Relation)
        expect(result).to include(old_transaction, today_transaction, future_transaction)
      end
    end

    describe '.on_or_before' do
      it 'returns transactions on or before the given datetime' do
        result = Transaction.on_or_before(Time.current.end_of_day)
        expect(result).to include(old_transaction, today_transaction)
        expect(result).not_to include(future_transaction)
      end

      it 'does not apply a date upper-bound when to_date is blank' do
        result = Transaction.on_or_before(nil)
        expect(result).to be_an(ActiveRecord::Relation)
        expect(result).to include(old_transaction, today_transaction, future_transaction)
      end
    end

    describe '.for_category' do
      it 'returns transactions for the given category id' do
        result = Transaction.for_category(category.id)
        expect(result).to include(old_transaction, today_transaction, future_transaction)
        expect(result).not_to include(other_category_tx)
      end

      it 'does not filter by category when category_id is blank' do
        result = Transaction.for_category(nil)
        expect(result).to be_an(ActiveRecord::Relation)
        expect(result).to include(old_transaction, today_transaction, future_transaction, other_category_tx)
      end
    end

    describe '.ordered_newest_first' do
      it 'orders transactions by date desc then created_at desc' do
        t1 = create(:transaction, budget: budget, category: category, date: 1.day.ago)
        t2 = create(:transaction, budget: budget, category: category, date: 2.days.ago)
        t3 = create(:transaction, budget: budget, category: category, date: Time.current)
        ordered = Transaction.ordered_newest_first.limit(3)
        expect(ordered.first.date).to be >= ordered.second.date
        expect(ordered.second.date).to be >= ordered.third.date
      end
    end

    describe '.for_user' do
      it 'returns transactions belonging to the user through budgets' do
        result = Transaction.for_user(user)
        ids = result.map(&:id)
        expect(ids).to include(old_transaction.id, today_transaction.id)
        expect(ids).not_to include(other_user_tx.id)
      end
    end
  end
end
