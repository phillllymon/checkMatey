FROM ruby:2.7.8-slim

ENV LANG=C.UTF-8 \
    RAILS_ENV=production \
    BUNDLE_WITHOUT=development:test \
    RAILS_LOG_TO_STDOUT=true \
    RAILS_SERVE_STATIC_FILES=true

WORKDIR /app

# This Ruby version's Debian base (bullseye) is EOL, so deb.debian.org 404s on
# its packages. Pin apt to the archived snapshot.debian.org mirror instead.
RUN sed -i \
      -e 's|^deb http://deb.debian.org|# &|' \
      -e 's|^# deb http://snapshot.debian.org|deb http://snapshot.debian.org|' \
      /etc/apt/sources.list && \
    apt-get update -o Acquire::Check-Valid-Until=false -o Acquire::Retries=5 -o Acquire::http::Timeout=60 && \
    apt-get install -y --no-install-recommends -o Acquire::Retries=5 -o Acquire::http::Timeout=60 \
      build-essential \
      libpq-dev \
      nodejs \
      git \
      curl && \
    rm -rf /var/lib/apt/lists/*

RUN gem install bundler -v 2.4.22 --no-document

COPY Gemfile Gemfile.lock ./
RUN bundle _2.4.22_ install --jobs 4 --retry 3

COPY . .

# A real secret is only needed at request time; assets:precompile just needs
# something present so Rails doesn't refuse to boot during the build.
RUN SECRET_KEY_BASE=dummy-build-key bundle _2.4.22_ exec rails assets:precompile

EXPOSE 3000
ENTRYPOINT ["bin/docker-entrypoint"]
