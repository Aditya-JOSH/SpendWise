class Transaction < ApplicationRecord
  belongs_to :budget
  belongs_to :category

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :description, presence: true
  validates :date, presence: true

  scope :on_or_after, ->(from_date) { where('date >= ?', from_date) if from_date.present? }
  scope :on_or_before, ->(to_date) { where('date <= ?', to_date) if to_date.present? }
  scope :for_category, ->(category_id) { where(category_id: category_id) if category_id.present? }
  scope :ordered_newest_first, -> { order(date: :desc, created_at: :desc) }
  scope :for_user, ->(user) {
    includes(:budget, :category)
      .joins(:budget)
      .where(budgets: { user_id: user.id })
  }
end
