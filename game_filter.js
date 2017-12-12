function hero_filter(children, hero_list, key, same_team){
  if (key == "all"){
    return children;
  }
  var new_children = [];
  if(same_team==1){
    for(i = 0; i < children.length; i++) {
      if(search_subset(hero_list, children[i].children[0].heroes.slice(0,5)) == true || search_subset(hero_list, children[i].children[0].heroes.slice(5,10)) == true){
        new_children.push(children[i]);
      }
    }
  }
  else{
    for(i = 0; i < children.length; i++) {
      if(search_subset(hero_list, children[i].children[0].heroes) == true){
        new_children.push(children[i]);
      }
    } 
  }
  return  new_children;
}

function search_subset(l1, l2){
  for (j = 0; j < l1.length; j++) {
    var f = false;
    for (k = 0; k < l2.length; k++) {
      if (l1[j] == l2[k]){
        f = true;
      }
    }
    if(f == false){
      return false;
    }
  }
  return true
}


function winner_filter(children, key) {
  if (key == "all"){
    return children;
  }
  var new_children = [];
  for(i = 0; i < children.length; i++) {
    if(children[i].winner == key){
      new_children.push(children[i]);
    }
  }
  return  new_children;
}
function duration_filter(children, lower_bound, upper_bound) {
  var new_children = [];
  for(i = 0; i < children.length; i++) {
    if(children[i].duration >= lower_bound && children[i].duration <= upper_bound){
      new_children.push(children[i]);
    }
  }
  return  new_children;
}
function tf_filter(children, lower_bound, upper_bound) {
  var new_children = [];  
  for(i = 0; i < children.length; i++) {
    if(children[i].children.length-1 >= lower_bound && children[i].children.length-1 <= upper_bound){
      new_children.push(children[i]);
    }
  }
  return  new_children;
}
function filter(root, min_duration, max_duration, min_tf, max_tf, hero_list, same_team) {
  var new_children = duration_filter(root.children, min_duration, max_duration);
  new_children = tf_filter(new_children, min_tf, max_tf);
  new_children = hero_filter(new_children, hero_list, "not_all", same_team);
  return new_children;
}