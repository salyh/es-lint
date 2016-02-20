var maxFileDescritporsRule = {
    group: "Basic",
    description: "Checks amount of max open file descriptors",
    execute: function (clusterHealth, clusterUpdateSettings, nodesStat, nodesInfo) {

        var sr = JSON.search(nodesStat, '//nodes/*/process[max_file_descriptors < 65000]');
        if(sr.length > 0) {
          return new LintResult('RED','Not all nodes have enough file descriptors','Check docs');
        } else {
          return new LintResult('GREEN','You have enough file descriptors on every node','Lucence uses a lot of files');
        }
    }
}

var mlockRule = {
    group: "Expert",
    description: "Checks mlockall enabled on all data nodes",
    execute: function (clusterHealth, clusterUpdateSettings, nodesStat, nodesInfo) {

        var sr = JSON.search(nodesInfo, '//nodes/*[process/mlockall="false" and settings/node/data="true"]');
        if(sr.length > 0) {
          return new LintResult('RED','You should have enabled mlockall on all data nodes','Add mlockall: true and check docs');
        } else {
          return new LintResult('GREEN','You have enabled mlockall on all data nodes','mlockall prevents JVM swapping');
        }
    }
}


var dedicatedMasterNodesRule = {
    group: "Basic",
    description: "Checks minimum count of dedicated master nodes",
    execute: function (clusterHealth, clusterUpdateSettings, nodesStat, nodesInfo) {
        var sr = JSON.search(nodesInfo, '//nodes/*/settings/node[master="true" and data="false"]');
        if(sr.length < 3) {
          return new LintResult('RED','You should have at least three dedicated master nodes, not '+sr.length,'Add nodes with master: true and data: false');
        } else {
          return new LintResult('GREEN','You have '+sr.length+' dedicated master nodes','Three or more dedicated master nodes make cluster more stable');
        }
    }
}

var dummyRule = {
    group: "Advanced",
    description: "dummy",
    execute: function (clusterHealth, clusterUpdateSettings, nodesStat, nodesInfo) {
        return new LintResult('YELLOW','dummy','solve it ')
    }
}

registerRule(dummyRule );
registerRule(dedicatedMasterNodesRule );
registerRule(mlockRule);
registerRule(maxFileDescritporsRule);
