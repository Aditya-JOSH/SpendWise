class ChangeDateToDatetimeInTransactions < ActiveRecord::Migration[6.1]
  def change
    change_column :transactions, :date, :datetime
  end
end
