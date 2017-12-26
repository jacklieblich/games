Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'games#index'

  scope '/api' do
    post :challenge, to: 'games#create'
    get :users, to: 'users#index'
    get :games, to: 'games#index'
    get '/game/:id', to: 'games#show'
    put 'move', to: 'games#update'
  end

  get '/games/get_game_types', to: 'games#get_game_types'
  post '/games/im_watching', to: 'games#im_watching'
  post '/games/nudge', to: 'games#nudge'

  mount ActionCable.server => '/cable'

  devise_for :users, controllers: {
    sessions: 'users/sessions',
    registrations: 'users/registrations',
    omniauth_callbacks: "users/omniauth_callbacks"
  }
  devise_scope :user do
    get 'users/get_current_user', :to => 'users/sessions#get_current_user'
  end
  
  if Rails.env.development?
    require 'sidekiq/web'
    mount Sidekiq::Web => '/sidekiq'
  end

end
