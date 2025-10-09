class BudgetSerializer
  include JSONAPI::Serializer
  attributes :id, :name, :financial_goal, :total_spent
  
  has_many :transactions

  # calculates the sum of all transactions for this budget. 
  def total_spent
    object.transactions.sum(:amount)
  end
end
