class Setting

	def self.url
		if Rails.env == "development"
			return "http://localhost:3000/"
		end
		if Rails.env == "production"
			return "https://dry-hollows-83799.herokuapp.com/"
		end
	end

end