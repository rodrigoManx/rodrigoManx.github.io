function draw_charts(diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list, chunk_size){
  var h_p = {};
  var radiant_wins = 0;
  var data_pc = [];
  var kills,
      deaths,
      assists,
      exp,
      gxp;
  for (i = 0; i < filtered_list.length; i++){
    for(j = 0; j < 5; j++){
      kills = Number(filtered_list[i].children[0].kills[j]);
      deaths = Number(filtered_list[i].children[0].deaths[j]);
      assists = Number(filtered_list[i].children[0].assists[j]);
      exp = Number(filtered_list[i].children[0].exp[j]);
      gxp = Number(filtered_list[i].children[0].gxp[j]);

      if (!h_p[filtered_list[i].children[0].heroes[j]]){
        h_p[filtered_list[i].children[0].heroes[j]] = [1,0,0,kills,deaths,assists,exp,gxp];
      }
      else {
        h_p[filtered_list[i].children[0].heroes[j]][0]++;
        h_p[filtered_list[i].children[0].heroes[j]][3]+=kills;
        h_p[filtered_list[i].children[0].heroes[j]][4]+=deaths;
        h_p[filtered_list[i].children[0].heroes[j]][5]+=assists;
        h_p[filtered_list[i].children[0].heroes[j]][6]+=exp;
        h_p[filtered_list[i].children[0].heroes[j]][7]+=gxp;
      }
      if(filtered_list[i].winner == "radiant"){
        radiant_wins+=1;
        h_p[filtered_list[i].children[0].heroes[j]][1]++;   
      }
      else{
        h_p[filtered_list[i].children[0].heroes[j]][2]++;    
      }
    }
    for(j = 5; j < 10; j++){
      kills = Number(filtered_list[i].children[0].kills[j]);
      deaths = Number(filtered_list[i].children[0].deaths[j]);
      assists = Number(filtered_list[i].children[0].assists[j]);
      exp = Number(filtered_list[i].children[0].exp[j]);
      gxp = Number(filtered_list[i].children[0].gxp[j]);

      if (!h_p[filtered_list[i].children[0].heroes[j]]){
        h_p[filtered_list[i].children[0].heroes[j]] = [1,0,0,kills,deaths,assists,exp,gxp];
      }
      else {
        h_p[filtered_list[i].children[0].heroes[j]][0]++;
        h_p[filtered_list[i].children[0].heroes[j]][3]+=kills;
        h_p[filtered_list[i].children[0].heroes[j]][4]+=deaths;
        h_p[filtered_list[i].children[0].heroes[j]][5]+=assists;
        h_p[filtered_list[i].children[0].heroes[j]][6]+=exp;
        h_p[filtered_list[i].children[0].heroes[j]][7]+=gxp;  
      }
      if(filtered_list[i].winner == "dire"){
        h_p[filtered_list[i].children[0].heroes[j]][1]++;   
      }
      else{
        h_p[filtered_list[i].children[0].heroes[j]][2]++;    
      }
    }
  }

  var list_f = []; 
  Object.keys(h_p).forEach(function(key) {
      h_p[key][3] = (h_p[key][3]/h_p[key][0]).toFixed(4);
      h_p[key][4] = (h_p[key][4]/h_p[key][0]).toFixed(4);
      h_p[key][5] = (h_p[key][5]/h_p[key][0]).toFixed(4);
      h_p[key][6] = (h_p[key][6]/h_p[key][0]).toFixed(4);
      h_p[key][7] = (h_p[key][7]/h_p[key][0]).toFixed(4);

      h_p[key][1] = (h_p[key][1]/h_p[key][0]).toFixed(4);
      h_p[key][2] = (h_p[key][2]/h_p[key][0]).toFixed(4);
      h_p[key][0] = (h_p[key][0]/filtered_list.length).toFixed(4);
      

      var tmp_dict = {"h":key, "f":h_p[key][0], "w":h_p[key][1], "l":h_p[key][2]};
      var tmp_dict_b = {"name":key, "kills":h_p[key][3],"deaths":h_p[key][4],"assists":h_p[key][5],"exp":h_p[key][6],"gxp":h_p[key][7]};
      list_f.push(tmp_dict);
      data_pc.push(tmp_dict_b);
  });
  h_p = [];
  var columns = ["kills", "deaths", "assists", "exp", "gxp"];
  data_pc["columns"] = columns;
  //console.log(data_pc);
  list_f.sort(function(first, second) {
   return second.f - first.f;
  });
  list_f = list_f.slice(0,110);
  var game_results = [{"n":"radiant", "s":radiant_wins/5},{"n":"dire", "s":filtered_list.length-(radiant_wins/5)}];
  
  draw_bars(list_f);
  display_parallel_coordinates(data_pc);
  draw_pie_chart(game_results, diameter_teamfights_vis, margin_c_teamfights_vis, filtered_list, chunk_size);
}