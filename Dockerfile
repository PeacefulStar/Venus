FROM almalinux:latest AS OS
LABEL authors="venus"

ARG user
ARG pass

RUN dnf -y update \
    && dnf -y groupinstall 'Development Tools' \
    && dnf install -y sudo bind procps-ng rsyslog-logrotate postfix s-nail \
    && /usr/sbin/rndc-confgen -a -b 512 -k rndc-key \
    && chmod 755 /etc/rndc.key \
    && useradd -m -s /bin/bash $user \
    && echo $user:$pass | chpasswd \
    && echo "$user ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

EXPOSE 53/UDP
EXPOSE 53/TCP
EXPOSE 8008

CMD ["/usr/sbin/init"]


FROM almalinux:latest AS Web

RUN dnf -y update \
    && dnf -y groupinstall 'Development Tools' \
    && dnf install -y sudo procps-ng \
    && useradd -m -s /bin/bash linuxbrew  \
    && echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers

USER linuxbrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

USER root
ENV PATH="/home/linuxbrew/.linuxbrew/bin:/home/linuxbrew/.linuxbrew/sbin:${PATH}"
RUN git config --global --add safe.directory /home/linuxbrew/.linuxbrew/Homebrew \
    && brew update \
    && brew install nvm node yarn

WORKDIR /usr/src/app
COPY package.json .
COPY ./packages/client/package.json packages/client/
COPY ./packages/server/package.json packages/server/
RUN yarn install
COPY . .

EXPOSE 3000

CMD ["yarn", "virtual"]
