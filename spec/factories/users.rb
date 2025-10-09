FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { 'password123' }
    name { "User #{rand(1..100)}" }
    role { 'user' }
  end
end
