FROM amd64/node:gallium-slim AS devServer
LABEL authors="venus"

WORKDIR /usr/src/app
COPY package.json .
COPY ./packages/client/package.json packages/client/
COPY ./packages/server/package.json packages/server/
RUN yarn install
COPY . .
RUN apt-get update \
    && apt-get -y install sudo build-essential procps curl file git  \
    && useradd -m -s /bin/bash linuxbrew  \
    && echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers

USER linuxbrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

USER root
ENV PATH="/home/linuxbrew/.linuxbrew/bin:${PATH}"
RUN brew upgrade

CMD yarn virtual-server


FROM dokken/centos-stream-9:latest AS devOS
LABEL authors="venus"

RUN yum -y update \
    && yum -y groupinstall 'Development Tools' \
    && yum install -y bind procps-ng curl file git \
    && /usr/sbin/rndc-confgen -a -b 512 -k rndc-key \
    && chmod 755 /etc/rndc.key \
    && useradd -m -s /bin/bash linuxbrew  \
    && echo 'linuxbrew ALL=(ALL) NOPASSWD:ALL' >>/etc/sudoers

USER linuxbrew
RUN /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

USER root
ENV PATH="/home/linuxbrew/.linuxbrew/bin:${PATH}"
RUN brew upgrade

EXPOSE 53/UDP
EXPOSE 53/TCP
EXPOSE 8008

CMD ["/usr/sbin/init"]
