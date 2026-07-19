"""Unit tests for the Suricata EVE JSON parser."""

from datetime import datetime

from backend.detection.eve_parser import AlertEvent, EVEEvent, EVEParser


def test_parse_alert_event_returns_alert_event():
    raw = {
        "timestamp": "2024-01-15T14:23:11.456789+0000",
        "event_type": "alert",
        "src_ip": "203.0.113.100",
        "src_port": 49152,
        "dest_ip": "192.0.2.50",
        "dest_port": 8080,
        "proto": "TCP",
        "flow_id": 1847291847382,
        "alert": {
            "signature": "ET EXPLOIT Test Rule",
            "signature_id": 2030450,
            "category": "Attempted Administrator Privilege Gain",
            "severity": 1,
        },
    }
    event = EVEParser.parse(raw)

    assert isinstance(event, AlertEvent)
    assert event.src_ip == "203.0.113.100"
    assert event.dst_ip == "192.0.2.50"
    assert event.protocol == "TCP"
    assert event.signature == "ET EXPLOIT Test Rule"
    assert event.signature_id == 2030450
    assert event.severity == 1
    assert isinstance(event.timestamp, datetime)


def test_parse_non_alert_event_returns_base_event():
    raw = {
        "timestamp": "2024-01-15T14:23:11.456789+0000",
        "event_type": "dns",
        "src_ip": "10.0.0.5",
        "dest_ip": "8.8.8.8",
        "proto": "UDP",
    }
    event = EVEParser.parse(raw)

    assert isinstance(event, EVEEvent)
    assert not isinstance(event, AlertEvent)
    assert event.event_type == "dns"
    assert event.dst_ip == "8.8.8.8"


def test_parse_malformed_event_never_raises():
    # Missing fields and a bad timestamp must not crash the parser.
    event = EVEParser.parse({"event_type": "alert"})
    assert isinstance(event, AlertEvent)
    assert event.signature == "Unknown"


def test_parse_defaults_timestamp_when_missing():
    event = EVEParser.parse({"event_type": "flow"})
    assert isinstance(event.timestamp, datetime)
