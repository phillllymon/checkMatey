Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  mount ActionCable.server => '/cable'

  namespace :api, defaults: { format: :json } do
    resources :users
    resources :posts
    resource :session, only: [:create, :destroy]
    resources :scores, only: [:index, :create, :show]
    resources :games, only: [:create, :show]
    resources :email, only: [:create]
    
  end
  
  root "static_pages#root" 

end
