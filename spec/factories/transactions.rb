FactoryBot.define do
  factory :transaction do
    amount { rand(10..1000) }
    description { "Transaction #{rand(1..100)}" }
    date { Time.current }
    association :budget
    association :category
  end
end
