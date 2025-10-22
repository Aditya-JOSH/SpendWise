Rails.application.routes.draw do

  devise_for :users, path: '', path_names: {
                                 sign_in: 'login',
                                 sign_out: 'logout',
                                 registration: 'signup'
                               },
                     controllers: {
                       sessions: 'users/sessions',
                       registrations: 'users/registrations'
                     }
  get '/member_details' => 'members#index'
  namespace :api do
    namespace :v1 do
      resources :budgets, only: [:index, :create, :show, :update, :destroy] do
        resources :transactions, only: [:index, :create, :show, :update, :destroy]
      end

      resources :categories, only: [:index, :create, :show, :update, :destroy]
      resources :transactions, only: [:index, :destroy]
    end
  end
  # Routing logic: fallback requests for React Router.
  # Leave this here to help deploy your app later!
  # get "*path", to: "fallback#index", constraints: ->(req) { !req.xhr? && req.format.html? }
end
