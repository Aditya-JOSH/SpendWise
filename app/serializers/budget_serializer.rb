class BudgetSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :financial_goal, :created_at, :updated_at

  attribute :spent do |budget|
    budget.total_spent
  end

  attribute :remaining do |budget|
    budget.remaining_amount
  end

  has_many :transactions
  belongs_to :user
end
