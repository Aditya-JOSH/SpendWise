class AddJtiToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :jti, :string, null: false
    add_index :users, :jti, unique: true
    # Ex:- add_index("admin_users", "username")
  end
end
