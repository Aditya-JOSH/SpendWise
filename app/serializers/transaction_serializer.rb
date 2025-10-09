class TransactionSerializer
  include JSONAPI::Serializer
  attributes :id, :description, :amount, :date, :created_at, :updated_at

  belongs_to :budget
  belongs_to :category
end
