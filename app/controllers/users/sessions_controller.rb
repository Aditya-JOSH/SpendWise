# frozen_string_literal: true

module Users
  class SessionsController < Devise::SessionsController
    include RackSessionsFix

    respond_to :json

    private

    def respond_with(_resource, _options = {})
      render json: {
        status: { code: 200, message: 'User signed in successfully',
                  data: { user: UserSerializer.new(current_user).serializable_hash.dig(:data, :attributes) } }
      }, status: :ok
    end

    def respond_to_on_destroy
      if current_user
        current_user.update(jti: SecureRandom.uuid)
      end
      render json: {
        status: 200,
        message: 'Logged out successfully (or already logged out).'
      }, status: :ok
    end
  end
end
