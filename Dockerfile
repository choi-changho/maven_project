FROM image-registry.openshift-image-registry.svc:5000/openshift/jboss-webserver31-tomcat8-openshift:1.4
COPY ROOT.war /deployments/ROOT.war
RUN ["ls", "-alrh", "/deployments"]
