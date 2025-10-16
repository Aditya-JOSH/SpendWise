class Category < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :restrict_with_error

  validates :name, presence: true, uniqueness: { scope: :user_id }

  scope :ordered_by_name, -> { order(name: :asc) }
end
