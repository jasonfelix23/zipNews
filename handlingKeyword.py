import subprocess
import sys
subprocess.check_call([sys.executable, "-m", "pip", "install", "rake-nltk"])
from rake_nltk import Rake

def find_some_keywords(text):
    r = Rake()
    r.extract_keywords_from_text(text)
    res = r.get_ranked_phrases_with_scores()
    return res
