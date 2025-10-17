class CategorySerializer
  include JSONAPI::Serializer

  attributes :id, :name, :created_at, :updated_at

  has_many :transactions
  belongs_to :user
end
