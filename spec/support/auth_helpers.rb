# This module helps create valid JWTs for request specs.
module AuthHelpers
  def auth_headers(user)
    # The JWT_SECRET_KEY is loaded from `credentials.yml.enc`
    secret_key = Rails.application.credentials.jwt_secret_key
    
    # The payload contains the claims for the token.
    payload = {
      sub: user.id,
      jti: user.jti,
      exp: 24.hours.from_now.to_i
    }
    
    token = JWT.encode(payload, secret_key, 'HS256')
    
    { 'Authorization' => "Bearer #{token}" }
  end
end
