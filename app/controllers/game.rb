set :protection, except: :session_hijacking

post '/start' do
  @player = []
  @player[1] = Player.where(name: params[:player]["1"]).first_or_create
  @player[2] = Player.where(name: params[:player]["2"]).first_or_create
  Game.create
  PlayerGame.create(game: Game.last, player: @player[1])
  PlayerGame.create(game: Game.last, player: @player[2])
  session[:player1] = @player[1]
  session[:player2] = @player[2]
  erb :racer
end

post '/restart' do
  @player = []
  @player[1] = session[:player1]
  @player[2] = session[:player2]
  Game.create
  PlayerGame.create(game: Game.last, player: @player[1])
  PlayerGame.create(game: Game.last, player: @player[2])
  erb :racer
end

post '/' do
  session[:player1] = nil
  session[:player2] = nil
  erb :index
end

post '/results' do
  this_game = Game.last
  case params["winner"]
  when "1"
    winner_name = PlayerGame.where(game_id: this_game.id)[0].player.name
  when "2"
    winner_name = PlayerGame.where(game_id: this_game.id)[1].player.name
  end
  this_game.winner_id = Player.where(name: winner_name).first.id
  this_game.time = params["time"].to_f
  this_game.save
  @message = winner_name << " won with time " << params["time"] << " second(s)"
  erb :results
end

get '/game/:id' do
  this_game = Game.find(params[:id])
  winner = Player.find(this_game.winner_id)
  @time = this_game.time
  players = PlayerGame.where(game_id: this_game.id)
  if players[0].player == winner
    @winner_name = players[0].player.name
    @competitor_name = players[1].player.name
  else
    @winner_name = players[1].player.name
    @competitor_name = players[0].player.name
  end

  erb :game_summary
end