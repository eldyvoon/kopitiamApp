<div ng-repeat="content in threadContent track by $index" class="list card">

  <div class="item item-avatar">
    <img class="avatar" ng-src="{{content.avatar}}">
    <h2>{{content.name}}</h2>
    <p class="contentDate">{{content.date}}</p>
  </div>

  <div class="item item-body">
    <p ng-bind-html="content.content" class="content">
    </p>
  </div>

</div>