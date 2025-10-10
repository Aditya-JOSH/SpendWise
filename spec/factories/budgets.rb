FactoryBot.define do
  factory :budget do
    sequence(:name) { |n| "Budget #{n}" }
    financial_goal { rand(1000..10000) }
    association :user
  end
end
