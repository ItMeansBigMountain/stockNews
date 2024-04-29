import json
from ibm_watson import NaturalLanguageUnderstandingV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator
from ibm_watson.natural_language_understanding_v1 import Features, EntitiesOptions, KeywordsOptions, CategoriesOptions, ConceptsOptions, EmotionOptions, RelationsOptions, SemanticRolesOptions, SentimentOptions, SyntaxOptions

import configparser

# SECRETS
import os
config = configparser.ConfigParser()
thisfolder = os.path.dirname(os.path.abspath(__file__))
initfile = os.path.join(thisfolder, 'secrets.ini')
config.read(initfile)


def login():
  watson_apikey = config.get('WATSON', 'watson_apikey')
  watson_instance_URL = config.get('WATSON', 'watson_instance_URL')
  authenticator = IAMAuthenticator(watson_apikey)
  natural_language_understanding = NaturalLanguageUnderstandingV1(
      version='2022-04-07',
      authenticator=authenticator)
  natural_language_understanding.set_service_url(watson_instance_URL)
  return natural_language_understanding


def analyzeText(client, text):
  # Analyze Text
  response = client.analyze(
      text=text,
      features=Features(
          entities=EntitiesOptions(emotion=True, sentiment=True, limit=2),
          keywords=KeywordsOptions(emotion=True, sentiment=True, limit=2),
          categories=CategoriesOptions(limit=100),
          concepts=ConceptsOptions(limit=100),
          emotion=EmotionOptions(),
          relations=RelationsOptions(),
          semantic_roles=SemanticRolesOptions(keywords=True , entities=True),
          sentiment=SentimentOptions(),
          syntax=SyntaxOptions(sentences=True),
          )
    ).get_result()
  return json.dumps(response, indent=2)


