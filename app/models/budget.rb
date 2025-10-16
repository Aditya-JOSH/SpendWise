class Budget < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy

  validates :name, presence: true
  validates :financial_goal, presence: true, numericality: { greater_than: 0 }
end
