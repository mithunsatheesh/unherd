def getRetweet(tweetObj):
	"""
		Returns value of the feature retweet count as per the
		logic.
		TODO:
			Variable score depending on the retweet count.
	"""

	# Retweeted by the logged in user or not.
	isRetweeted = tweetObj['retweeted']
	retweet_count = tweetObj['retweet_count']
	
	rscore = retweet_count/50
	if(rscore > 4):
		rscore = 4
	return rscore

def getURL(tweetObj):
	"""
		Returns value of the feature URL content in the tweetObj.
		TODO : return value based on the relevant or importance of
			   the URL.
	"""		
	entities = tweetObj['entities']
	urls = entities['urls']

	return len(urls)

def getHashTags(tweetObj):		

	entities = tweetObj['entities']
	hashTags = entities['hashtags']

	return len(hashTags)

def getFavorite(tweetObj):

	favorite_count = tweetObj['favorite_count']
	if(favorite_count > 0):
		return 1
	else:
		return 0

def getTweetText(tweetObj):
	return tweetObj['text']

def getMentions(tweetObj):
	"""
	Returns count of mentions in tweet
	"""	
	entities = tweetObj['entities']
	mentions = entities['user_mentions']

	return len(mentions)

def getFollowersCount(tweetObj):
	"""
	Returns score as per the count of
	followers the author of tweet has
	"""	
	user = tweetObj['user']
	followers_count = user['followers_count']
	oneMillion = 1000000
	fscore = followers_count/oneMillion
	if(fscore > 4):
		fscore = 4

	return fscore
















