Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  scope '/api' do
  	post :login, to: 'users#login'
    post :challenge, to: 'games#create'
    get :users, to: 'users#index'
    get :games, to: 'games#index'
    get '/game/:id', to: 'games#show'
    put 'move', to: 'games#update'
  end
end
