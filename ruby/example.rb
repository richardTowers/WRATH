require_relative 'Templates/AddContact'

puts AddContact.new.render({
	:contactRef => 123456789,
	:partRef => 987654321,
	:ratingNotes => [
		{ :ref => '1234', :value => 'Value' },
		{ :ref => '5678', :value => 'Tell' },
		{ :ref => '8901', :value => 'Me' },
	]
})