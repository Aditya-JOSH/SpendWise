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
end
