cat Login.js PryvEventLoader.js Subject.js GenericDataModel.js LatestEventData.js UsernameLatestEventData.js CategoryEventData.js UsernameCategoryEventData.js  NavHeaderView.js EventView.js CategoryView.js LatestEventView.js AlertView.js LoadingView.js MainController.js pryv.js Main.js > ../Production_DashboardOltenQuestionnaires/bundled.js
#cp *.html ../Production_DashboardOltenQuestionnaires/
#cp *.css ../Production_DashboardOltenQuestionnaires/
cd ../Production_DashboardOltenQuestionnaires/
babel bundled.js > bundled_transpiled.js
