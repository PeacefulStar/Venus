FROM dokken/centos-stream-9:latest AS devOS
LABEL authors="venus"

ARG user
ARG pass

RUN echo -e "\
[mongodb-org-6.0]\n\
name=MongoDB Repository\n\
baseurl=https://repo.mongodb.org/yum/redhat/8/mongodb-org/6.0/x86_64/\n\
gpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc\n\
gpgcheck=1\n\
enabled=1\n" >> /etc/yum.repos.d/mongodb-org-6.0.repo

RUN yum -y update \
    && yum -y groupinstall 'Development Tools' \
    && yum install -y sudo bind procps-ng curl file git mongodb-org \
    && /usr/sbin/rndc-confgen -a -b 512 -k rndc-key \
    && chmod 755 /etc/rndc.key \
    && useradd -m -s /bin/bash linuxbrew  \
    && echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers \
    && useradd -m -s /bin/bash $user \
    && echo $user:$pass | chpasswd \
    && echo "$user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

USER linuxbrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

USER $user
RUN export PATH="/home/linuxbrew/.linuxbrew/bin:${PATH}"

USER root
ENV PATH="/home/linuxbrew/.linuxbrew/bin:${PATH}"
RUN git config --global --add safe.directory /home/linuxbrew/.linuxbrew/Homebrew \
    && brew install gcc nvm node mongosh yarn \
    && usermod -G root,linuxbrew venus \
    && chmod 755 /home/linuxbrew

EXPOSE 53/UDP
EXPOSE 53/TCP
EXPOSE 8008

WORKDIR /usr/src/app
COPY package.json .
COPY ./packages/client/package.json packages/client/
COPY ./packages/server/package.json packages/server/
RUN yarn install
COPY . .

CMD yarn virtual-server
