class BudgetSerializer
  include JSONAPI::Serializer

  attributes :id, :name, :financial_goal, :created_at, :updated_at

  has_many :transactions
  belongs_to :user
end
